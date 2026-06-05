
class MySQLHandler:
    def __init__(self, host, user, password, database, port=3306):
        """初始化数据库连接参数"""
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.port = port
        self.connection = None

    def connect(self):
        """建立数据库连接"""
        try:
            self.connection = pymysql.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                port=self.port,
                cursorclass=DictCursor  # 使查询结果以字典形式返回
            )
            print("数据库连接成功")
            return True
        except Exception as e:
            print(f"数据库连接失败: {e}")
            return False

    def create_table(self):
        """创建示例表"""
        if not self.connection:
            print("请先建立数据库连接")
            return

        try:
            with self.connection.cursor() as cursor:
                # 创建用户表
                sql = """
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(50) NOT NULL,
                    age INT,
                    email VARCHAR(100) UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
                cursor.execute(sql)
            self.connection.commit()
            print("表创建成功或已存在")
        except Exception as e:
            print(f"创建表失败: {e}")
            self.connection.rollback()

    def insert_data(self, name, age, email):
        """插入数据"""
        if not self.connection:
            print("请先建立数据库连接")
            return

        try:
            with self.connection.cursor() as cursor:
                sql = "INSERT INTO users (name, age, email) VALUES (%s, %s, %s)"
                cursor.execute(sql, (name, age, email))
            self.connection.commit()
            print(f"插入成功，ID: {cursor.lastrowid}")
            return cursor.lastrowid
        except Exception as e:
            print(f"插入数据失败: {e}")
            self.connection.rollback()
            return None

    def query_data(self, condition=None):
        """查询数据"""
        if not self.connection:
            print("请先建立数据库连接")
            return []

        try:
            with self.connection.cursor() as cursor:
                if condition:
                    sql = f"SELECT * FROM users WHERE {condition}"
                else:
                    sql = "SELECT * FROM users"
                
                cursor.execute(sql)
                result = cursor.fetchall()
                print(f"查询到 {len(result)} 条记录")
                return result
        except Exception as e:
            print(f"查询数据失败: {e}")
            return []

    def update_data(self, user_id, **kwargs):
        """更新数据"""
        if not self.connection or not kwargs:
            print("请先建立数据库连接并提供更新字段")
            return False

        try:
            # 构建更新语句
            update_fields = ", ".join([f"{k} = %s" for k in kwargs.keys()])
            values = list(kwargs.values()) + [user_id]
            
            with self.connection.cursor() as cursor:
                sql = f"UPDATE users SET {update_fields} WHERE id = %s"
                cursor.execute(sql, values)
            
            self.connection.commit()
            print(f"更新成功，影响行数: {cursor.rowcount}")
            return cursor.rowcount > 0
        except Exception as e:
            print(f"更新数据失败: {e}")
            self.connection.rollback()
            return False

    def delete_data(self, user_id):
        """删除数据"""
        if not self.connection:
            print("请先建立数据库连接")
            return False

        try:
            with self.connection.cursor() as cursor:
                sql = "DELETE FROM users WHERE id = %s"
                cursor.execute(sql, (user_id,))
            
            self.connection.commit()
            print(f"删除成功，影响行数: {cursor.rowcount}")
            return cursor.rowcount > 0
        except Exception as e:
            print(f"删除数据失败: {e}")
            self.connection.rollback()
            return False

    def close(self):
        """关闭数据库连接"""
        if self.connection:
            self.connection.close()
            print("数据库连接已关闭")
    def query_all_data(self):
        """查询表中所有数据"""
        if not self.connection:
            print("请先建立数据库连接")
            return []

        try:
            with self.connection.cursor() as cursor:
                sql = "SELECT * FROM users"
                cursor.execute(sql)
                result = cursor.fetchall()
                print(f"查询到所有记录，共 {len(result)} 条")
                return result
        except Exception as e:
            print(f"查询所有数据失败: {e}")
            return []


# 使用示例
if __name__ == "__main__":
    # 初始化数据库连接参数（请替换为你的实际信息）
    db_handler = MySQLHandler(
        host="localhost",
        user="root",
        password="bbbb",
        database="red"
    )
    
    # 连接数据库
    if db_handler.connect():
        # 创建表
        # db_handler.create_table()
        
        # 插入数据
        user_id = db_handler.insert_data("张三", 30, "zhangsan@example.com")
        
        # 查询数据
        all_users = db_handler.query_data()
        print("所有用户:", all_users)
        
        # 更新数据
        if user_id:
            db_handler.update_data(user_id, age=31, email="new_zhangsan@example.com")
        
        # # 条件查询
        # specific_user = db_handler.query_data(f"id = {user_id}")
        # print("特定用户:", specific_user)
        
        # # 删除数据
        # if user_id:
        #     db_handler.delete_data(user_id)
        
        # 关闭连接
        db_handler.close()
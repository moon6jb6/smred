<py-script>
    

import js
class chess:
    def __init__(self,typ,x,y):
        self.x = 0
        self.y = 0
        self.healthy = True
        self.class_name = typ
        self.update_set(x,y)
        self.may_move(x,y)
        
    

    def update_set(self,x,y):
        self.x , self.y = x , y





    def __typing(self):



    def __may_move(self):






class Ground：
    def __init__(self,numx,coler,line,row,gap,block_length,line_gong =[
                    (3, 0, 5, 2),  # 第一条对角线：从(3,0)到(5,2)
                    (5, 0, 3, 2),   # 第二条对角线：从(5,0)到(3,2)
                    (3, 7, 5, 9),  # 第一条对角线：从(3,7)到(5,9)
                    (5, 7, 3, 9)   # 第二条对角线：从(5,7)到(3,9)
                ] ):
        # 储存关卡相关信息时候用（关卡数，背景色，行数，列数，间距,斜线的坐标(选填)）
        self.line = line#列数
        self.row = row#行数
        self.ground = numx
        self.gap = gap
        self.ground_coler = coler
        self.block_length = block_length
        self.line_gong = line_gong
    
    
    
    def draw(self):
        bor = js.document.getElementById("ground")
        bor.style.position , bor.style.width , bor.style.height , bor.style.border = "relative" ， f"{(self.line - 1) * CELL_SIZE}px" ， f"{(self.row - 1) * CELL_SIZE}px" ， "2px solid #8B4513"
        bor.backgroundColor = self.ground_coler
        #画棋盘。。。。。

        #画竖线线
        for i in range(self.line)：
            lnie = js.document.createElement("div")
            #lnie.class_name = "lnie"
            lnie.style.position = "absolute"
            lnie.style.width = "1px"  # 线条宽度：1px（细实线）
            lnie.style.backgroundColor = "#000"  # 线条颜色：黑色
            lnie.style.left = f"{i*self.block_length}"px
            lnie.style.height = 40%
            bor.appendChild(lnie)#把线条添加进去

            lnie.style.position = "absolute"
            lnie.style.width = "1px"  # 线条宽度：1px（细实线）
            lnie.style.backgroundColor = "#000"  # 线条颜色：黑色
            lnie.style.left = f"{i*self.block_length}"px
            lnie.style.height = 40%
            lnie.style.bottom = "0px"
            bor.appendChild(lnie)#把线条添加进去
        for i in range(self.row):

            lnie.className = "board-line horizontal-line"
            lnie.style.top = f"{row * CELL_SIZE}px"
            board.appendChild(line)

        #画斜线的部分zzz.....
        svg = js.document.getElementById("diagonal-lines")
        svg.setAttribute("width", f"{(self.line - 1) * self.block_length}px")
        svg.setAttribute("height", f"{(self.row - 1) * self.block_length}px")
        for (x1, y1, x2, y2) in self.line_gong:
        # 创建SVG线段元素
            line_a = js.document.createElementNS("http://www.w3.org/2000/svg", "line")
            start_x = x1 * self.block_length
            start_y = y1 * self.block_length
            end_x = x2 * self.block_length
            end_y = y2 * self.block_length
            line_a.setAttribute("x1", f"{start_x}")
            line_a.setAttribute("y1", f"{start_y}")
            line_a.setAttribute("x2", f"{end_x}")
            line_a.setAttribute("y2", f"{end_y}")
            line_a.setAttribute("stroke", "#000")
            line_a.setAttribute("stroke-width", "1")
            svg.appendChild(line_a)


</py-script>
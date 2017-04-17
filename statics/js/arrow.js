function Arrow() {
    this.x = 0; //初始位置
    this.y = 0;
    this.x1 = 0; //初始位置
    this.y1 = 0;
    this.rotation1 = 0; //初始旋转角度
    this.color = '#ffff00';
}
//在原型上定义draw方法
Arrow.prototype.draw = function(cxt) {
        cxt.save();
        cxt.translate(this.x, this.y); //将坐标移到this.x 和 this.y
        cxt.rotate(this.rotation); //设置旋转角度
        cxt.lineWidth = 5; //设置线宽
        cxt.fillStyle = this.color; //设置填充色
        cxt.beginPath(); //路径开始
        cxt.moveTo(-50, -25);
        cxt.lineTo(0, -25);
        cxt.lineTo(0, -50);
        cxt.lineTo(50, 0);
        cxt.lineTo(0, 50);
        cxt.lineTo(0, 25);
        cxt.lineTo(-50, 25);
        cxt.closePath(); //路径闭合
        cxt.fill(); //填充
        cxt.stroke(); //描边

        cxt.restore();
    }
    // cxt.moveTo(0,0); 
    // cxt.lineTo(0,50); 
    // cxt.strokeStyle = 'rgba(255,0,0,0.5)'; 
    // cxt.stroke();
Arrow.prototype.draw1 = function(cxt) {
    cxt.save();
    cxt.translate(this.x1, this.y1); //将坐标移到this.x 和 this.y
    cxt.rotate(this.rotation1); //设置旋转角度
    cxt.lineWidth = 5; //设置线宽
    cxt.fillStyle = this.color; //设置填充色
    cxt.beginPath(); //路径开始
    cxt.moveTo(-50, -25);
    cxt.lineTo(0, -25);
    cxt.lineTo(0, -50);
    cxt.lineTo(50, 0);
    cxt.lineTo(0, 50);
    cxt.lineTo(0, 25);
    cxt.lineTo(-50, 25);

    cxt.closePath(); //路径闭合
    cxt.fill(); //填充
    cxt.stroke(); //描边

    cxt.restore();
}
关于在centos系统运行TokenMind后端文件的说明

1.将压缩包解压

2.安装项目以来。在命令行中执行 pip install -r requirements.text

3.启动项目
    a.在命令行运行 python packages/main_new.py
    b.将main_new.py文件中 uvicorn.run(app, host=host, port=port)的命令注释掉，
    在命令行中输入 uvicorn main:app --reload启动项目。
    注意项目启动的地址和端口后都可配置。

4.得到endpoint

p.s 可在.env 文件内配置项目的环境变量，包括agent_role,iteration_count，host，port等
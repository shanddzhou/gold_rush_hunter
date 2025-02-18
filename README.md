# GoldRush Hunter 量化交易系统

## 项目简介

GoldRush Hunter 是一个基于 Python Flask 和 Vue.js 的量化交易系统，提供用户认证、权限管理、交易策略等功能。

## 技术栈

### 后端
- Python 3.8+
- Flask 框架
- SQLAlchemy ORM
- PostgreSQL 数据库
- JWT 认证
- RESTful API
- Redis 缓存
- Celery 任务队列
- APScheduler 定时任务

### 前端
- Vue 3
- Element Plus UI
- Vuex 状态管理
- Vue Router
- Axios HTTP 客户端
- ECharts 图表库
- Socket.IO 实时通信

## 功能特性

### 已完成功能
1. 用户系统
   - 用户注册（支持邀请码）
   - 用户登录
   - 个人信息管理
   - 密码修改
   - 头像上传
   - 登录限制和保护

2. 权限管理
   - 基于角色的权限系统
   - 权限配置
   - 角色分配
   - 操作日志审计

3. 系统管理
   - 用户管理
   - 角色管理
   - 邀请码管理
   - 系统监控
   - 资源使用统计
   - 性能监控
   - 定时任务管理

### 开发中功能
1. 交易功能
   - 策略管理
   - 持仓管理
   - 订单管理
   - 风险控制
   - 资金管理

2. 数据分析
   - 市场数据
   - 交易数据
   - 绩效分析
   - 实时监控
   - 历史回测
   - 策略优化

## 项目结构

```
goldrush-hunter/
├── backend/                # 后端项目目录
│   ├── app/               # 应用主目录
│   │   ├── api/          # API 接口
│   │   ├── models/       # 数据模型
│   │   ├── services/     # 业务逻辑
│   │   ├── utils/        # 工具函数
│   │   ├── tasks/        # Celery 任务
│   │   ├── schedulers/   # 定时任务
│   │   └── websockets/   # WebSocket 服务
│   ├── migrations/       # 数据库迁移
│   ├── tests/           # 测试用例
│   ├── .env.example     # 环境变量示例
│   ├── config.py        # 配置文件
│   └── requirements.txt  # 依赖清单
│
├── frontend/             # 前端项目目录
│   ├── src/             # 源代码
│   │   ├── api/        # API 请求
│   │   ├── assets/     # 静态资源
│   │   ├── components/ # 组件
│   │   ├── layouts/    # 布局组件
│   │   ├── router/     # 路由配置
│   │   ├── store/      # Vuex 状态管理
│   │   ├── utils/      # 工具函数
│   │   └── views/      # 页面视图
│   └── package.json     # 依赖配置
│
└── README.md            # 项目文档
```

## 开发环境搭建

### 后端

#### 基础环境
1. 创建虚拟环境
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

#### 依赖服务
1. 安装并启动 Redis
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# CentOS
sudo yum install redis
sudo systemctl start redis

# macOS
brew install redis
brew services start redis
```

2. 安装并配置 PostgreSQL
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# CentOS
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql

# macOS
brew install postgresql
brew services start postgresql
```

### 前端

1. 安装依赖
```bash
cd frontend
npm install
```

2. 配置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，配置 API 地址
```

3. 运行开发服务器
```bash
npm run serve
```

## 部署指南

### 后端部署
1. 安装生产环境依赖
```bash
pip install -r requirements.txt
```

2. 配置环境变量
```bash
export FLASK_ENV=production
export DATABASE_URL=postgresql://user:password@localhost/dbname
```

3. 运行数据库迁移
```bash
flask db upgrade
```

4. 使用 Gunicorn 运行应用
```bash
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

### 前端部署
1. 构建生产版本
```bash
npm run build
```

2. Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 开发规范

### Git 提交规范
- feat: 新功能
- fix: 修复
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

### 代码风格
- 后端遵循 PEP 8 规范
- 前端遵循 ESLint 配置
- 使用 Black 格式化 Python 代码
- 使用 Prettier 格式化 JavaScript 代码

## 测试

### 后端测试
```bash
cd backend
pytest
```

### 前端测试
```bash
cd frontend
npm run test:unit
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 作者

- 作者名字 - email@example.com

## 致谢

- Element Plus
- Vue.js
- Flask
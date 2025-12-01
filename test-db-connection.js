import { config } from 'dotenv';
config(); // 加载 .env
import mysql from 'mysql2/promise';

async function testDbConnection() {
  console.log('开始测试数据库连接...');

  const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'articles',
  };

  console.log('使用以下配置进行连接：');
  console.log(`- 主机: ${dbConfig.host}`);
  console.log(`- 用户: ${dbConfig.user}`);
  console.log(`- 数据库: ${dbConfig.database}`);
  console.log('- 密码: ********');

  let connection;

  try {
    const pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('正在建立数据库连接...');
    connection = await pool.getConnection();
    console.log('✅ 成功连接到数据库！');

    console.log('正在验证 articles 表...');
    const [tables] = await connection.query("SHOW TABLES LIKE 'articles'");
    
    if (tables.length === 0) {
      console.log('❌ articles 表不存在');
      return;
    }

    console.log('✅ articles 表存在');
    const [rows] = await connection.query(
      "SELECT COUNT(*) as count FROM articles"
    );
    console.log(`当前共有 ${rows[0].count} 条记录`);

  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
  } finally {
    if (connection) connection.release();
  }
}

testDbConnection();

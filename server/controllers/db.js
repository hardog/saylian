const Db = require('../tools/db');

async function create(ctx, next) {
  const query = ctx.query;

  switch(query.name){
    case 'contents':
      ctx.body = await Db.schema.createTable('contents', function (table) {
        table.increments();
        table.text('content');
        table.enu('type', ['1', '2']);// 1:短文、2:视频
        table.string('path', 100);
        table.string('poster', 200);
        table.string('title', 40);
        table.bigInteger('groupid');
        table.text('meta');
        table.timestamp('created_at').defaultTo(Db.fn.now());
      });
      break;
    case 'words':
      ctx.body = await Db.schema.createTable('words', function (table) {
        table.increments();
        table.string('word');
        table.bigInteger('userid');
        table.bigInteger('contentid');
        table.timestamp('created_at').defaultTo(Db.fn.now());
      });
      break;
    case 'daily': // 每日一句
      ctx.body = await Db.schema.createTable('daily', function (table) {
        table.increments();
        table.string('sentence', 100);
        table.string('translate', 100);
        table.string('path', 100);
        table.string('poster', 200);
        table.text('meta');
        table.timestamp('created_at').defaultTo(Db.fn.now());
      });
      break;
    case 'group': // 学习分组
      ctx.body = await Db.schema.createTable('group', function (table) {
        table.increments();
        table.string('poster', 200);
        table.string('title', 40);
        table.boolean('learn').defaultTo(false);
        table.timestamp('created_at').defaultTo(Db.fn.now());
      });
      break;
    case 'dailyfollow': // 每日一句跟读
      ctx.body = await Db.schema.createTable('dailyfollow', function (table) {
        table.increments();
        table.bigInteger('dailyid');
        table.bigInteger('userid');
        table.string('path', 100);
        table.bigInteger('like');
        table.timestamp('created_at').defaultTo(Db.fn.now());
      });
      break;
    case 'videos': // 精选视频
      ctx.body = await Db.schema.createTable('videos', function (table) {
        table.increments();
        table.string('path', 100);
        table.string('title', 40);
        table.string('poster', 200);
        table.text('meta');
        table.bigInteger('groupid');
        table.timestamp('created_at').defaultTo(Db.fn.now());
      });
      break;
    case 'task': // 任务表
      ctx.body = await Db.schema.createTable('task', function (table) {
        table.increments();
        table.bigInteger('userid');
        table.bigInteger('contentid');
        table.bigInteger('lastLearnTime');
        table.bigInteger('time'); // 单位s
        table.boolean('isfinish').defaultTo(false);
        table.timestamp('created_at').defaultTo(Db.fn.now());
      });
      break;
    case 'feedback':
      ctx.body = await Db.schema.createTable('feedback', function (table) {
        table.increments();
        table.text('content');
        table.bigInteger('userid');
        table.string('type'); //from daily or main mini program
        table.timestamp('created_at').defaultTo(Db.fn.now());
      });
      break;
    case 'comments':
      ctx.body = await Db.schema.createTable('comments', function (table) {
        table.increments();
        table.text('content');
        table.string('avator');
        table.bigInteger('userid');
        table.bigInteger('contentid');
        table.boolean('checked').defaultTo(false);
        table.timestamp('created_at').defaultTo(Db.fn.now());
      });
      break;
    case 'films':
      ctx.body = await Db.schema.createTable('films', function (table) {
        table.increments();
        table.string('title');
        table.string('link');
        table.timestamp('created_at').defaultTo(Db.fn.now());
      });
      break;
    case 'rgArticles':
      ctx.body = await Db.schema.createTable('rgArticles', function (table) {
        table.increments();
        table.text('content');
        table.text('intro');
        table.string('title', 200);
        table.string('link', 200);
        table.integer('readtime').defaultTo(0);
        table.integer('watch').defaultTo(0);
        table.timestamp('created_at').defaultTo(Db.fn.now());
      });
      break;
    case 'rgComments':
      ctx.body = await Db.schema.createTable('rgComments', function (table) {
        table.increments();
        table.text('content');
        table.string('avator');
        table.bigInteger('userid');
        table.bigInteger('rgid');
        table.boolean('checked').defaultTo(false);
        table.timestamp('created_at').defaultTo(Db.fn.now());
      });
      break;
    case 'rgCollects':
      ctx.body = await Db.schema.createTable('rgCollects', function (table) {
        table.increments();
        table.string('rgid');
        table.bigInteger('userid');
        table.timestamp('created_at').defaultTo(Db.fn.now());
      });
      break;
    default: 
      ctx.body = `table name ${query.name}, no schema`;
      break;
  };
}

module.exports = {
  create
};
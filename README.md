# 关于【说练英语】（微信小程序）

说练英语是一款程序员为自己量身打造的英语学习助手，使用过程完全免费，代码开源遵循MIT开源协议！

# 协作开发

* 每个版本将以issue的形式发布即将上线的新功能，开发者可以接受PR针对单个feature开发然后提交到master分支。
* 分支命名规范：features/xxx
* issue命名规范：
```
  1. 版本号命名的issue列表对应版本将新增的所有功能 
  2. 具体开发时将对应的PR关联issue即可
  3. 接受feature时，在对应feature后面@开发者即可
```
* 主分支: master
* 需要参与开发同学可以加作者微信【ncu_zp】，将授权你加入开发者

# 关于数据库设计
```
  // cSessionInfo：用户表
  open_id、uuid(作为后面关联的id)、user_info 关联的用户信息（来自微信授权）
  
  // contents：主内容表包括分类中（短片学习、精选短文）
    table.increments();
    table.text('content');       // 正文内容
    table.enu('type', ['1', '2']);  // 1:短文、2:视频
    table.string('path', 100);    // 音频/视频路径
    table.string('poster', 200);   // 封面路径
    table.string('title', 40);      // 文章标题
    table.text('meta');          // 文章元信息（观看、喜欢、正在学习、点赞等）
    table.timestamp('created_at').defaultTo(Db.fn.now());
  
  // words: 收藏的单词表（收藏的单词会关联对应的文章，知道单词是从哪篇文章关联而来）
    table.increments();
    table.string('word');       // 收藏的单词
    table.bigInteger('userid');   // 用户id
    table.bigInteger('contentid'); // contents 表的id
    table.timestamp('created_at').defaultTo(Db.fn.now());

  // daily: 每日一句表
    table.increments();
    table.string('sentence', 100);  // 句子
    table.string('translate', 100);  // 句子翻译
    table.string('path', 100);     // 音频路径
    table.string('poster', 200);    // 封面
    table.text('meta');          // 元信息（like数）
    table.timestamp('created_at').defaultTo(Db.fn.now());

  // dailyfollow: 每日一句 跟读表
    table.increments();
    table.bigInteger('dailyid');  // 关联daily表的id
    table.bigInteger('userid');  // 关联user表的id
    table.string('path', 100);  // 跟读音频路径
    table.bigInteger('like');    // 跟读like数
    table.timestamp('created_at').defaultTo(Db.fn.now());

  // videos: 分类中的【随便看看】视频表
    table.increments();
    table.string('path', 100);  // 视频路径
    table.string('title', 40);    // 视频标题
    table.string('poster', 200); // 封面
    table.text('meta');       // 元信息（like、watch数）
    table.timestamp('created_at').defaultTo(Db.fn.now());
  
  // task: 学习任务表
    table.increments();
    table.bigInteger('userid');           // 管理的user id
    table.bigInteger('contentid');        // 关联的学习文章contents id
    table.bigInteger('lastLearnTime');     // 上次学习时间
    table.bigInteger('time'); // 单位s     // 总学习时长单位(s)
    table.boolean('isfinish').defaultTo(false); // 是否完成学习
    table.timestamp('created_at').defaultTo(Db.fn.now());

  // feedback: 反馈表
    table.increments();
    table.text('content');    // 反馈内容
    table.bigInteger('userid'); // 管理的用户表 id
    table.string('type'); // 来源暂为main
    table.timestamp('created_at').defaultTo(Db.fn.now());

  // comments: 评论表
    table.increments();
    table.text('content');      // 评论内容
    table.string('avator');      // 评论用户头像
    table.bigInteger('userid');   // 关联的用户id
    table.bigInteger('contentid'); // 关联的内容contents id
    table.boolean('checked').defaultTo(false);  // 评论是否审核通过
    table.timestamp('created_at').defaultTo(Db.fn.now());
```
# 基本认知
```
学英语重点包括：听力、口语、发音、阅读
辅助学习类型：音频、视频、文章及结合互动
Phase1: 听力&生词
Phase2: 口语
Phase3: 阅读
Phase4: 发音
```
# License

The project is released under the terms of the MIT.
// 此处主机域名修改成腾讯云解决方案分配的域名
const host = 'https://280812961.uva-lover.cn';//'https://cvodwuls.qcloud.la'; //
const cos = 'https://uva-1256719691.cos.ap-shanghai.myqcloud.com/';
const config = {
    title: '成长在于每天的积累',
    headurl: '../../images/sl.png',
    cacheKey: 'sl-userInfo',

    cosPrefix: cos,
    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // urls
        upload: `${host}/weapp/contents/upload`,
        list: `${host}/weapp/contents/list`,
        queryByContentsId: `${host}/weapp/contents/queryById`,
        listByType: `${host}/weapp/contents/listByType`,
        listByGroupid: `${host}/weapp/contents/listByGroupid`,
        wcollects: `${host}/weapp/contents/collects`,
        words: `${host}/weapp/contents/words`,
        meta: `${host}/weapp/contents/meta`,
        updateVideoMeta: `${host}/weapp/contents/updateVideoMeta`,

        // task 相关
        updateTaskTime: `${host}/weapp/task/updateTaskTime`,
        hasTask: `${host}/weapp/task/hasTask`,
        startTask: `${host}/weapp/task/startTask`,
        endTask: `${host}/weapp/task/endTask`,

        daily: `${host}/weapp/daily/query`,
        follows: `${host}/weapp/daily/follows`,
        queryById: `${host}/weapp/daily/queryById`,
        updateMeta: `${host}/weapp/daily/updateMeta`,
        updateFollowLike: `${host}/weapp/daily/updateFollowLike`,
        updateDailyLike: `${host}/weapp/daily/updateDailyLike`,
        addFollow: `${host}/weapp/daily/addFollow`,


        loginUrl: `${host}/weapp/login`,
        translate: `${host}/weapp/tool/translate`,
        comment: `${host}/weapp/assist/comment`,
        collect: `${host}/weapp/assist/collect`,
        comments: `${host}/weapp/assist/comments`,
        feedback: `${host}/weapp/assist/feedback`,
    }
};

module.exports = config;

import Mock from 'mockjs2'
import { builder } from '../util'

const funcitonDetailData = [

    {
        "functionId": "607e7dba690adc2f87385eb0",
        "functionName": "ab后台历史实验下线实验",
        "delay": "noDelay",
        "qaJobDays": 0.0,
        "rdJobDays": 3.0
    },
    {
        "functionId": "607e7dba690adc2f87385ebc",
        "functionName": "用户任务系统",
        "delay": "noDelay",
        "qaJobDays": 3.0,
        "rdJobDays": 5.0
    },
    {
        "functionId": "607e7dbb690adc2f87385ee1",
        "functionName": "主播招募认证",
        "delay": "noDelay",
        "qaJobDays": 0.0,
        "rdJobDays": 11.5
    },
    {
        "functionId": "607e7dbb690adc2f87385f34",
        "functionName": "附近动态号位隐藏实验",
        "delay": "noDelay",
        "qaJobDays": 0.5,
        "rdJobDays": 0.0
    },
    {
        "functionId": "607e7dbb690adc2f87385f42",
        "functionName": "主播招募页面新增数据埋点需求",
        "delay": "noDelay",
        "qaJobDays": 0.5,
        "rdJobDays": 0.0
    },
    {
        "functionId": "607e8301690adc2f87385fdb",
        "functionName": "吃鸡优化",
        "delay": "noDelay",
        "qaJobDays": 3.0,
        "rdJobDays": 7.0
    },
    {
        "functionId": "607e7dbb690adc2f87385f39",
        "functionName": "公演直播间",
        "delay": "noDelay",
        "qaJobDays": 4.0,
        "rdJobDays": 9.0
    },
    {
        "functionId": "607fd170f63f42001ed5afa7",
        "functionName": "进房间接口优化一期",
        "delay": "noDelay",
        "qaJobDays": 0.0,
        "rdJobDays": 6.0
    },
    {
        "functionId": "60813cc8f63f42001e1c9ff5",
        "functionName": "【OBS】登录优化",
        "delay": "noDelay",
        "qaJobDays": 0.0,
        "rdJobDays": 1.0
    },
    {
        "functionId": "60827635f63f42001e53c364",
        "functionName": "推荐帧位置收拢",
        "delay": "noDelay",
        "qaJobDays": 2.0,
        "rdJobDays": 21.0
    },
    {
        "functionId": "608b9e27f63f42001e160923",
        "qaJobDays": 0.0,
        "rdJobDays": 0.0
    },
    {
        "functionId": "608b9e79f63f42001e1623c5",
        "qaJobDays": 0.0,
        "rdJobDays": 0.0
    },
    {
        "functionId": "607e7dbb690adc2f87385f3c",
        "functionName": "超级流量卡",
        "delay": "noDelay",
        "qaJobDays": 2.0,
        "rdJobDays": 0.0
    }
    
  ]
const functionDetailMock = () => {
    return builder(funcitonDetailData)
}

Mock.mock(/\/api\/BusinessController\/getFunctionDetails/, 'post', functionDetailMock)

const functionData = [
/*     {
      key: '1',
      project: '营收产品',
      functions: 2234,
      devdays: 1123,
      testdays: 1234,
      cases: 3999,
      delayfunctionrate: '50%',
    },
    {
      key: '2',
      project: '营收活动',
      functions: 2234,
      devdays: 1123,
      testdays: 1234,
      cases: 3999,
      delayfunctionrate: '50%',
    },
    {
      key: '3',
      project: 'pk',
      functions: 2234,
      devdays: 1123,
      testdays: 1234,
      cases: 3999,
      delayfunctionrate: '50%',
    },
    {
      key: '4',
      project: '社交',
      functions: 2234,
      devdays: 1123,
      testdays: 1234,
      cases: 3999,
      delayfunctionrate: '50%',
    },
    {
      key: '5',
      project: '增长',
      functions: 2234,
      devdays: 1123,
      testdays: 1234,
      cases: 3999,
      delayfunctionrate: '50%',
    },
    {
      key: '6',
      project: '基础',
      functions: 2234,
      devdays: 1123,
      testdays: 1234,
      cases: 3999,
      delayfunctionrate: '50%',
    }, */

{
            "caseCount": 2474,
            "functionSum": 34,
            "projectId": "5daea9908dc1d270efc6c013",
            "projectName": "基础",
            "qaSumJobDays": 0.0,
            "rdSumJobDays": 0.0,
            "delayfunctionrate":'10%',
            "delayCount": 0
        },
        {
            "caseCount": 73,
            "functionSum": 25,
            "projectId": "5f5b4f5d09b87000115f5583",
            "projectName": "社交内容",
            "qaSumJobDays": 0.0,
            "rdSumJobDays": 0.0,
            "delayfunctionrate":'10%',
            "delayCount": 0
        },
        {
            "caseCount": 0,
            "functionSum": 7,
            "projectId": "60641002f63f42001e2faa5c",
            "projectName": "营收产品",
            "qaSumJobDays": 0.0,
            "rdSumJobDays": 0.0,
            "delayfunctionrate":'10%',
            "delayCount": 1
        },
        {
            "caseCount": 0,
            "functionSum": 0,
            "projectId": "606447abf63f42001e412b36",
            "projectName": "营收活动",
            "qaSumJobDays": 0.0,
            "rdSumJobDays": 0.0,
            "delayfunctionrate":'10%',
            "delayCount": 1
        },
        {
            "caseCount": 0,
            "functionSum": 13,
            "projectId": "60768cf5f63f42001e348480",
            "projectName": "增长",
            "qaSumJobDays": 12.0,
            "rdSumJobDays": 20.0,
            "delayfunctionrate":'10%',
            "delayCount": 3
        }
    ]

const functionMock = () => {
    return builder(functionData)
}

Mock.mock(/\/BusinessController\/getQualityData/, 'post', functionMock)
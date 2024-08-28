import Mock from 'mockjs2'
import { builder } from '../util'

const businessCountData = [
    {
        "project_name": "社交",
        "functionCount": 25,
        "delayCount": 0
    },
    {
        "project_name": "营收活动",
        "functionCount": 25,
        "delayCount": 0
    },
    {
        "project_name": "PK",
        "functionCount": 26,
        "delayCount": 1
    },
    {
        "project_name": "基础",
        "functionCount": 60,
        "delayCount": 1
    },
    {
        "project_name": "营收产品",
        "functionCount": 67,
        "delayCount": 1
    },
    {
        "project_name": "增长",
        "functionCount": 74,
        "delayCount": 1
    }
];

const businessCountDataMock = () => {
    return builder(businessCountData)
}

Mock.mock(/\/api\/BusinessController\/getBusinessVolume/, 'post', businessCountDataMock)


const getDevelopmentHoursData = [
    {
        "ProjectId": "5daea9908dc1d270efc6c013",
        "ProjectName": "基础",
        "qajobDays": 0.0,
        "rdjobDays": 0.0
    },
    {
        "ProjectId": "5f5b4f5d09b87000115f5583",
        "ProjectName": "社交内容",
        "rdjobDays": 2.0,
        "qajobDays": 0.0
    },
    {
        "ProjectId": "60641002f63f42001e2faa5c",
        "ProjectName": "营收产品",
        "qajobDays": 0.0,
        "rdjobDays": 0.0
    },
    {
        "ProjectId": "606447abf63f42001e412b36",
        "ProjectName": "营收活动",
        "qajobDays": 0.0,
        "rdjobDays": 0.0
    },
    {
        "ProjectId": "60768cf5f63f42001e348480",
        "ProjectName": "增长",
        "rdjobDays": 63.5,
        "qajobDays": 15.0
    }
];

const getDevelopmentHoursDataMock = () => {
    return builder(getDevelopmentHoursData)
}

Mock.mock(/\/api\/BusinessController\/getDevelopmentHours/, 'post', getDevelopmentHoursDataMock)

const betaBugData = [
    {
        "projectId": "5daea9908dc1d270efc6c013",
        "projectName": "营收产品",
        "sumBug": 320,
        "bugCount": 0,
        "rdCaseCount": 16,
        "rdPassCaseCount": 0
    },
    {
        "projectId": "5f5b4f5d09b87000115f5583",
        "projectName": "营收活动",
        "sumBug": 476,
        "bugCount": 0,
        "rdCaseCount": 39,
        "rdPassCaseCount": 39
    },
    {
        "projectId": "60641002f63f42001e2faa5c",
        "projectName": "PK",
        "sumBug": 48,
        "bugCount": 44,
        "rdCaseCount": 0,
        "rdPassCaseCount": 0
    },
    {
        "projectId": "606447abf63f42001e412b36",
        "projectName": "社交",
        "sumBug": 0,
        "bugCount": 0,
        "rdCaseCount": 0,
        "rdPassCaseCount": 0
    },
    {
        "projectId": "60768cf5f63f42001e348480",
        "projectName": "增长",
        "sumBug": 1,
        "bugCount": 0,
        "rdCaseCount": 0,
        "rdPassCaseCount": 0
    },
    {
        "projectId": "60768cf5f63f42001e348480",
        "projectName": "基础",
        "sumBug": 11,
        "bugCount": 0,
        "rdCaseCount": 0,
        "rdPassCaseCount": 0
    }
]


const betaBugDataMock = () => {
    return builder(betaBugData)
}

Mock.mock(/\/api\/BusinessController\/getBetaBugCount/, 'post', betaBugDataMock)


const prodBugData = [
    {
        "name": "营收产品",
        "value": 4
    },
    {
        "name": "营收活动",
        "value": 0
    },
    {
        "name": "PK",
        "value": 0
    },
    {
        "name": "社交",
        "value": 16
    },
    {
        "name": "增长",
        "value": 20
    },
    {
        "name": "基础",
        "value": 0
    },
]

const prodBugDataMock = () => {
    return builder(prodBugData)
}

Mock.mock(/\/api\/VipOrderController\/getVipOrder/, 'post', prodBugDataMock)

const qualityData = [
/*     {
      key: '1',
      project: '营收产品',
      projectId:'60641002f63f42001e2faa5c',
      betabugs: 234,
      bugfixrate: '80%',
      bugrate: '10%',
      probugs: 10,
      smokequality: '50%',
    }, */
    {
        "projectId": "5daea9908dc1d270efc6c013",
        "sumBug": 320,
        "bugCount": 0,
        "rdCaseCount": 16,
        "rdPassCaseCount": 0,
        "onlineBug": 0,
        "productName": "基础"
    },
    {
        "projectId": "5f5b4f5d09b87000115f5583",
        "sumBug": 476,
        "bugCount": 0,
        "rdCaseCount": 39,
        "rdPassCaseCount": 39,
        "onlineBug": 1,
        "productName": "社交内容"
    },
    {
        "projectId": "60641002f63f42001e2faa5c",
        "sumBug": 48,
        "bugCount": 44,
        "rdCaseCount": 0,
        "rdPassCaseCount": 0,
        "onlineBug": 7,
        "productName": "营收产品"
    },
    {
        "projectId": "606447abf63f42001e412b36",
        "sumBug": 0,
        "bugCount": 0,
        "rdCaseCount": 0,
        "rdPassCaseCount": 0,
        "onlineBug": 0,
        "productName": "营收活动"
    },
    {
        "projectId": "60768cf5f63f42001e348480",
        "sumBug": 1,
        "bugCount": 0,
        "rdCaseCount": 0,
        "rdPassCaseCount": 0,
        "onlineBug": 1,
        "productName": "增长"
    }
  ]
const qualityDataMock = () => {
    return builder(qualityData)
}

Mock.mock(/\/BusinessController\/getBetaBugCount/, 'post', qualityDataMock)

const faultData = [
    /*     {
          key: '1',
          project: '营收产品',
          projectId:'60641002f63f42001e2faa5c',
          betabugs: 234,
          bugfixrate: '80%',
          bugrate: '10%',
          probugs: 10,
          smokequality: '50%',
        }, */
        {
            "projectId": "5daea9908dc1d270efc6c013",
            "value": 3,
            "type": "p3",
            "productName": "基础"
        },
        {
            "projectId": "5f5b4f5d09b87000115f5583",
            "value": 3,
            "type": "p4",
            "productName": "社交内容"
        },
        {
            "projectId": "60641002f63f42001e2faa5c",
            "value": 3,
            "type": "p3",
            "productName": "营收产品"
        },
        {
            "projectId": "606447abf63f42001e412b36",
            "value": 3,
            "type": "p5",
            "productName": "营收活动"
        },
        {
            "projectId": "60768cf5f63f42001e348480",
            "value": 3,
            "type": "p3",
            "productName": "增长"
        }
      ]
    const faultDataMock = () => {
        return builder(faultData)
    }
    
    Mock.mock(/\/api\/faultController\/getFaultData/, 'post', faultDataMock)
import Mock from 'mockjs2'
import { builder } from '../util'


const qualityData = [
    {
      key: '1',
      project: '营收产品',
      betabugs: 234,
      bugfixrate: '80%',
      bugrate: '10%',
      probugs: 10,
      smokequality: '50%',
    },
    {
      key: '2',
      project: '营收活动',
      betabugs: 234,
      bugfixrate: '80%',
      bugrate: '10%',
      probugs: 10,
      smokequality: '50%',
    },
    {
      key: '3',
      project: 'pk',
      betabugs: 234,
      bugfixrate: '80%',
      bugrate: '10%',
      probugs: 10,
      smokequality: '50%',
    },
    {
      key: '4',
      project: '社交',
      betabugs: 234,
      bugfixrate: '80%',
      bugrate: '10%',
      probugs: 10,
      smokequality: '50%',
    },
    {
      key: '5',
      project: '增长',
      betabugs: 234,
      bugfixrate: '80%',
      bugrate: '10%',
      probugs: 10,
      smokequality: '50%',
    },
    {
      key: '6',
      project: '基础',
      betabugs: 234,
      bugfixrate: '80%',
      bugrate: '10%',
      probugs: 10,
      smokequality: '50%',
    },
  ]
const qualityDataMock = () => {
    return builder(qualityData)
}

Mock.mock(/\/api\/QualityController\/getQualityVolume/, 'post', qualityDataMock)


const qualityDetailData = [
  {
    key: '1',
    project: '营收产品',
    functionName:'需求1',
    betabugs: 234,
    bugfixrate: '80%',
    bugrate: '10%',
    probugs: 10,
    smokequality: '50%',
  },
  {
    key: '2',
    project: '营收产品',
    functionName:'需求2',
    betabugs: 234,
    bugfixrate: '80%',
    bugrate: '10%',
    probugs: 10,
    smokequality: '50%',
  },
  {
    key: '3',
    project: '营收产品',
    functionName:'需求3',
    betabugs: 234,
    bugfixrate: '80%',
    bugrate: '10%',
    probugs: 10,
    smokequality: '50%',
  },

]
const qualityDetailMock = () => {
  return builder(qualityDetailData)
}

Mock.mock(/\/api\/QualityDetailController\/getQualityDetail/, 'post', qualityDetailMock)
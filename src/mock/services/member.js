import Mock from 'mockjs2'
import { builder } from '../util'

const tagCloudData = () => {
    return builder({ 'total': 123, 'newLine': 23, 'deleted': 50 })
}

Mock.mock(/\/api\/member\/getCodeLines/, 'get', tagCloudData)

const rdData = []
for (let i = 0; i < 50; i += 1) {
  rdData.push({
    index: i + 1,
    name: `张三-${i}`,
    functionNum: Math.floor(Math.random() * 1000),
    codeNum: Math.floor(Math.random() * 1000),
    bugNum: Math.floor(Math.random() * 1000),
    codeVsbugComparison: Math.floor(Math.random() * 1000),
    unresolvedBug: Math.floor(Math.random() * 1000),
    unresolvedBugProbability: Math.floor(Math.random() * 1000),
  })
}

const rdDataMock = () => {
    return builder(rdData)
}

Mock.mock(/\/api\/RDPersonalController\/getRDPersonalDetails/, 'post', rdDataMock)

const qaData = []

for (let i = 0; i < 50; i += 1) {
  qaData.push({
    index: i + 1,
    name: `李四-${i}`,
    functionNum: Math.floor(Math.random() * 1000),
    writeCaseNum: Math.floor(Math.random() * 1000),
    executeCaseNum: Math.floor(Math.random() * 1000),
    submitBugNum: Math.floor(Math.random() * 1000),
    missBugNum: Math.floor(Math.random() * 1000),
    missBugProbability: Math.floor(Math.random() * 100),
  })
}

const qaDataMock = () => {
    return builder(qaData,"success",0)
}

Mock.mock(/\/api\/QAPersonalController\/getQAPersonalDetails/, 'post', qaDataMock)

const codeAnalysisData = {
  "codeNum": 13491,
  "addCodeNum": 9980,
  "delCodeNum": 1000,
  "addProportion": 0.349,
"comparison":0.1,
"comparisonDirection":"up"
}

const codeAnalysisDataMock = () => {
  return builder(codeAnalysisData,"success",0)
}
Mock.mock(/\/api\/RDPersonalController\/getCodeAnalysis/, 'post', codeAnalysisDataMock)


const publicBetaTestCaseData =   {
  "caseNum": 1134,
  "manualCaseNum": 990,
  "autoCaseNum": 144,
  "autoProportion": 0.126,
}

const publicBetaTestCaseDataMock = () => {
  return builder(publicBetaTestCaseData,"success",0)
}
Mock.mock(/\/api\/QAPersonalController\/getPublicBetaTestCase/, 'post', publicBetaTestCaseDataMock)

import request from '@/utils/request'

export function getFunction(stime, etime) {
  return request({
    url: '/api/BusinessController/getBusinessVolume',
    method: 'post',
    headers: {
      'Content-type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    },
    data: {
      stime,
      etime,
    }
  })
}


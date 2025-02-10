import axios from 'axios'
import { Client, } from '@line/bot-sdk'
import {getEnv} from '../config/remoteConfig.config.js'

// メッセージ送信
export const sendMessage = async (
  userLineId,
  message,
) => {
  const token = await getEnv('LINE_CHANNEL_ACCESS_TOKEN')
  const secret = await getEnv('LINE_CHANNEL_SECRET')

  const client = new Client({
    channelAccessToken: token,
    channelSecret: secret,
  })

  // メッセージの送信
  await client.pushMessage(
    userLineId,
    message
  )
}


// クライアントのトークンからユーザのID等を取得
export const getUserInfo = async(token) => {
  const res = await axios.get(
    'https://api.line.me/oauth2/v2.1/userinfo',
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
    },
  )

  if (res.status === 200) {
    return res.data
  } else {
    console.log(res)
    return null
  }
}
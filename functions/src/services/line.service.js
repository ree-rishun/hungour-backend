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

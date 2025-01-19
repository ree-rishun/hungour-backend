import admin from 'firebase-admin'

export default class RemoteConfig {
  constructor() {
    this.remoteConfig = null
  }

  // 初期化処理
  async init() {
    if (!admin.apps.length) {
      await admin.initializeApp()
    }
    this.remoteConfig = await admin.remoteConfig().getTemplate()
    console.log(this.remoteConfig)
  }

  // 環境変数の取得処理
  getEnv(path) {
    console.log(`${path} : ${this.remoteConfig.parameters[path]?.defaultValue.value}`)
    return this.remoteConfig.parameters[path]?.defaultValue.value ?? null
  }
}

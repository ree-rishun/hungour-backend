import admin from 'firebase-admin'

export const configs = {}

const initRemoteConfig = async () => {
  if (!admin.apps.length) {
    await admin.initializeApp()
  }
  const remoteConfig = await admin.remoteConfig().getTemplate()

  for (const key in remoteConfig.parameters) {
    configs[key] = remoteConfig.parameters[key]
  }
}

export const getEnv = async (path) => {
  if (Object.keys(configs).length === 0) {
    await initRemoteConfig()
  }
  return configs[path]?.defaultValue.value ?? null
}

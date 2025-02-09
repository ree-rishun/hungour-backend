import { google } from 'googleapis'
import {getEnv} from '../config/remoteConfig.config.js'

export const deployPod = async (conciergeId) => {
  try {
    const auth = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    })
    const kubernetes = google.container({
      version: 'v1',
      auth: auth,
    })
    const projectId = await getEnv('PROJECT_ID')
    const deploymentName = await getEnv('DEPLOYMENT_NAME')
    const request = {
      parent: `projects/${projectId}/locations/${await getEnv('REGION')}/clusters/${await getEnv('CLUSTER_NAME')}`,
      body: {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          name: deploymentName,
          namespace: await getEnv('NAMESPACE'),
        },
        spec: {
          replicas: 1,  // 1つのPodを作成
          selector: {
            matchLabels: {
              app: deploymentName,
            },
          },
          template: {
            metadata: {
              labels: {
                app: deploymentName,
                conciergeId: conciergeId,
              },
            },
            spec: {
              containers: [
                {
                  name: 'app',
                  image: getEnv('STREAMING_SERVER_IMAGE'),
                  env: [
                    {
                      name: 'CONCIERGE_ID',
                      value: conciergeId,
                    },
                    {
                      name: 'PROJECT_ID',
                      value: projectId,
                    },
                    {
                      name: 'API_URL',
                      value: await getEnv('API_URL'),
                    },
                    {
                      name: 'TWILIO_ACCOUNT_SID',
                      value: await getEnv('TWILIO_ACCOUNT_SID'),
                    },
                    {
                      name: 'TWILIO_AUTH_TOKEN',
                      value: await getEnv('TWILIO_AUTH_TOKEN'),
                    },
                    {
                      name: 'TWILIO_TEL_FROM',
                      value: await getEnv('TWILIO_TEL_FROM'),
                    },
                    {
                      name: 'GEMINI_API_KEY',
                      value: await getEnv('GEMINI_API_KEY'),
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    }

    await kubernetes.projects.locations.clusters.nodePools.create(request)
    return null
  } catch (err) {
    return err
  }
}
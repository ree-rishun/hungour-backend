import axios from 'axios'
import { google } from 'googleapis'
import https from 'https'
import {getEnv} from '../config/remoteConfig.config.js'

export const deployPod = async (conciergeId) => {
  try {
    const auth = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    })
    const container = google.container({
      version: 'v1',
      auth: auth,
    })
    const projectId = await getEnv('PROJECT_ID')
    const cluster = await container.projects.locations.clusters.get({
      name: `projects/${projectId}/locations/${await getEnv('REGION')}/clusters/${await getEnv('CLUSTER_NAME')}`,
    })
    const deploymentName = await getEnv('DEPLOYMENT_NAME')
    const namespace = await getEnv('NAMESPACE')
    const req = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: deploymentName,
        namespace: namespace,
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
                image: await getEnv('STREAMING_SERVER_IMAGE'),
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
    }
    const token = await auth.getAccessToken()

    console.log('デプロイ実行')
    const res = await axios.post(
      `https://${cluster.data.endpoint}/apis/batch/v1/namespaces/${namespace}/jobs`,
      req,
      {
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // 証明書の検証をスキップ
      }),
    });

    console.log(res)
    return null
  } catch (err) {
    console.error(err)
  }
}
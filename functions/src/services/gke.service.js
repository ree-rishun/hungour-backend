import { execSync } from 'child_process'
import { getEnv } from '../config/remoteConfig.config.js'

export const deployPod = (conciergeId) => {
  try {
    // Kubernetes Job の YAML を作成
    const jobYaml = `
apiVersion: batch/v1
kind: Job
metadata:
  name: concierge-${conciergeId}
spec:
  template:
    metadata:
      labels:
        concierge-id: "${conciergeId}"
    spec:
      restartPolicy: Never
      containers:
      - name: process-worker
        image: ${getEnv('STREAMING_SERVER_IMAGE')}
        env:
        - name: CONCIERGE_ID
          value: "${conciergeId}"
        - name: 
          value: "${getEnv('PROJECT_ID')}"
        - name: 
          value: "${getEnv('API_URL')}"
        - name: 
          value: "${getEnv('TWILIO_ACCOUNT_SID')}"
        - name: 
          value: "${getEnv('TWILIO_AUTH_TOKEN')}"
        - name: 
          value: "${getEnv('TWILIO_TEL_FROM')}"
        - name: 
          value: "${getEnv('GEMINI_API_KEY')}"
  backoffLimit: 0
`

    // YAML を適用して Job を作成
    execSync(
      `echo '${jobYaml}' | gcloud container clusters get-credentials ${getEnv('CLUSTER_NAME')} --region ${getEnv('REGION')} && kubectl apply -f -`,
      { stdio: "inherit" }
    )

    return null
  } catch (err) {
    return err
  }
}
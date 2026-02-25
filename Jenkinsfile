pipeline {

    agent none

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }

    stages {

        stage('Smoke Tests') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.58.2-jammy'
                    reuseNode true
                }
            }

            steps {
                checkout scm
                sh 'npm ci'
                sh 'npx playwright test --grep "@smoke"'
            }
        }

        stage('Regression Tests') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.58.2-jammy'
                    reuseNode true
                }
            }

            steps {
                checkout scm
                sh 'npm ci'
                sh 'npx playwright test --grep "@regression"'
            }
        }
    }

    post {

        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }

        success {
            emailext(
                subject: "✅ SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                <h2>Build Passed 🎉</h2>
                <p>View Report: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                """,
                to: "poulomidas89@gmail.com",
                mimeType: 'text/html'
            )
        }

        failure {
            emailext(
                subject: "❌ FAILURE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                <h2>Build Failed ❌</h2>
                <p>Console: <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
                """,
                to: "poulomidas89@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}

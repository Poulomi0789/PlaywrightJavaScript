pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }

    stages {

        stage('Initialize') {
            steps {
                checkout scm
            }
        }

        stage('Run Tests') {
            parallel {

                stage('Smoke Tests') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright:v1.58.2-jammy'
                            reuseNode true
                        }
                    }
                    steps {
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
                        sh 'npm ci'
                        sh 'npx playwright test --grep "@regression"'
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh 'npx allure generate allure-results --clean -o allure-report'
            }
        }
    }

    post {

        always {
            archiveArtifacts artifacts: 'playwright-report/**, allure-report/**', allowEmptyArchive: true
        }

        success {
            emailext(
                subject: "✅ SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <h2>Build Passed 🎉</h2>
                    <p><b>Smoke & Regression executed successfully.</b></p>
                    <p>Allure Report is attached in artifacts.</p>
                    <p>Jenkins Build: <a href='${env.BUILD_URL}'>Link</a></p>
                """,
                to: "poulomidas89@gmail.com",
                mimeType: 'text/html'
            )
        }

        failure {
            emailext(
                subject: "❌ FAILURE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: "<h2>Build Failed</h2><p>Check console: <a href='${env.BUILD_URL}console'>Logs</a></p>",
                to: "poulomidas89@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}

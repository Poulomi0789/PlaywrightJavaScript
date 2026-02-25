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
    }

    post {

        always {
            // Archive reports and Allure results
            archiveArtifacts artifacts: '**/playwright-report/**, **/allure-results/**',
                             allowEmptyArchive: true

            // Publish Allure Report (Requires Allure Jenkins Plugin)
            allure([
                includeProperties: false,
                jdk: '',
                results: [[path: 'allure-results']]
            ])
        }

        success {
            emailext(
                subject: "✅ SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <h2>Build Passed 🎉</h2>
                    <p>
                        📊 <b>Allure Report:</b> ${env.BUILD_URL}allure/<br>
                        📁 <b>Artifacts:</b> ${env.BUILD_URL}artifact/
                    </p>
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
                    <p>
                        View Console Logs:<br>
                        <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a>
                    </p>
                """,
                to: "poulomidas89@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}

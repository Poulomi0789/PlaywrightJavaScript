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
                        sh 'PLAYWRIGHT_HTML_REPORT=smoke-report npx playwright test --grep "@smoke"'
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
                        sh 'PLAYWRIGHT_HTML_REPORT=regression-report npx playwright test --grep "@regression"'
                    }
                }
            }
        }

        // ✅ NEW ALLURE STAGE (ADDED ONLY THIS)
        stage('Generate Allure Report') {
            steps {
                sh 'npx allure generate allure-results --clean -o allure-report'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'smoke-report/**, regression-report/**, allure-report/**', allowEmptyArchive: true
        }

        success {
            emailext(
                subject: "✅ SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                <h2>Build Passed 🎉</h2>
                <p>Allure Report Generated Successfully.</p>
                <p>View Build: <a href='${env.BUILD_URL}'>${env.BUILD_URL}</a></p>
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
                <p>Check Allure Report in artifacts.</p>
                <p>Console: <a href='${env.BUILD_URL}console'>${env.BUILD_URL}console</a></p>
                """,
                to: "poulomidas89@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}

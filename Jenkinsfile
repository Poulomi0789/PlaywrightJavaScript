pipeline {

    agent any

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }

    environment {
        NODE_IMAGE = "node:20"
        BASE_URL = "https://practicetestautomation.com"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Clean Old Reports') {
            steps {
                sh 'rm -rf playwright-report allure-results'
            }
        }

        stage('Parallel Test Execution') {

            parallel {

                stage('Smoke Tests') {
                    agent {
                        docker {
                            image "${NODE_IMAGE}"
                            reuseNode true
                        }
                    }

                    steps {
                        timeout(time: 10, unit: 'MINUTES') {
                            sh """
                            npm install
                            npx playwright install --with-deps
                            npx playwright test --grep "@smoke" \
                            --reporter=allure-playwright
                            """
                        }
                    }
                }

                stage('Regression Tests') {
                    agent {
                        docker {
                            image "${NODE_IMAGE}"
                            reuseNode true
                        }
                    }

                    steps {
                        timeout(time: 10, unit: 'MINUTES') {
                            sh """
                            npm install
                            npx playwright install --with-deps
                            npx playwright test --grep "@regression" \
                            --reporter=allure-playwright
                            """
                        }
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                allure includeProperties: false,
                       jdk: '',
                       results: [[path: 'allure-results']]
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
                <h2>Build Successful 🎉</h2>
                <p>Environment: ${BASE_URL}</p>
                <p>Build URL: <a href='${env.BUILD_URL}'>Open</a></p>
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
                <p>Check Console: <a href='${env.BUILD_URL}console'>Logs</a></p>
                """,
                to: "poulomidas89@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}

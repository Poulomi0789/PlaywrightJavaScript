pipeline {

    agent none

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }

    environment {
        NODE_IMAGE = "node:20"
        BASE_URL = "https://practicetestautomation.com"
    }

    stages {

        stage('Checkout') {
            agent any
            steps {
                checkout scm
            }
        }

        stage('Clean Workspace') {
            agent any
            steps {
                sh 'rm -rf playwright-report allure-results'
            }
        }

        stage('Parallel Execution by Tag') {

            parallel {

                stage('Smoke Tests') {
                    agent {
                        docker {
                            image "${NODE_IMAGE}"
                            reuseNode true
                        }
                    }

                    steps {
                        sh '''
                            npm install
                            npx playwright install
                            npx playwright test --grep "@smoke" --reporter=allure-playwright
                        '''
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
                        sh '''
                            npm install
                            npx playwright install
                            npx playwright test --grep "@regression" --reporter=allure-playwright
                        '''
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            agent any
            steps {
                allure includeProperties: false,
                       jdk: '',
                       results: [[path: 'allure-results']]
            }
        }

        stage('Publish HTML Report') {
            agent any
            steps {
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright HTML Report'
                ])
            }
        }
    }

    post {

        always {
            archiveArtifacts artifacts: 'playwright-report/**'
        }

        success {
            emailext(
                subject: "✅ SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <h2>Build Successful 🎉</h2>
                    <p>Environment: ${BASE_URL}</p>
                    <p>Build URL: <a href='${env.BUILD_URL}'>Open Jenkins Build</a></p>
                    <p>Allure Report available in Jenkins.</p>
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
                    <p>Check Console Output:</p>
                    <p><a href='${env.BUILD_URL}console'>Open Console</a></p>
                """,
                to: "poulomidas89@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}
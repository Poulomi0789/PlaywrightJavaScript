pipeline {

    agent any

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
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
                            image "mcr.microsoft.com/playwright:latest"
                            reuseNode true
                        }
                    }

                    steps {
                        sh '''
                        npm install
                        npx playwright test --grep "@smoke"
                        '''
                    }
                }

                stage('Regression Tests') {
                    agent {
                        docker {
                            image "mcr.microsoft.com/playwright:latest"
                            reuseNode true
                        }
                    }

                    steps {
                        sh '''
                        npm install
                        npx playwright test --grep "@regression"
                        '''
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
                subject: "✅ SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Build Passed. Check Jenkins for reports.",
                to: "poulomidas89@gmail.com",
                mimeType: 'text/html'
            )
        }

        failure {
            emailext(
                subject: "❌ FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Build Failed. Check console logs.",
                to: "poulomidas89@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}

pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }

    stages {
        stage('Initialize') {
            steps {
                // Checkout once here to avoid the index.lock conflict
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
                        // checkout scm removed from here
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
                        // checkout scm removed from here
                        sh 'npm ci'
                        sh 'PLAYWRIGHT_HTML_REPORT=regression-report npx playwright test --grep "@regression"'
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'smoke-report/**, regression-report/**', allowEmptyArchive: true
        }

        success {
            emailext(
                subject: "✅ SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: "<h2>Build Passed 🎉</h2><p>View Reports: <a href='${env.BUILD_URL}'>${env.BUILD_URL}</a></p>",
                to: "poulomidas89@gmail.com",
                mimeType: 'text/html'
            )
        }

        failure {
            emailext(
                subject: "❌ FAILURE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: "<h2>Build Failed ❌</h2><p>Console: <a href='${env.BUILD_URL}console'>${env.BUILD_URL}console</a></p>",
                to: "poulomidas89@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}

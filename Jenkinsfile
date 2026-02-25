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
                allure includeProperties: false,
                       jdk: '',
                       results: [[path: 'allure-results']]
            }
        }
    }

    post {

        always {
            archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
        }

        success {
            emailext(
                subject: "✅ SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                <h2>Build Passed 🎉</h2>
                <p><b>View Jenkins Report:</b></p>
                <p><a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                <p><b>Allure Report Available in Jenkins UI</b></p>
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
                <p>Check Console:</p>
                <p><a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
                <p><b>Allure Results Archived</b></p>
                """,
                to: "poulomidas89@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}

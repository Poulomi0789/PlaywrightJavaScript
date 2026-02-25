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
                    image 'mcr.microsoft.com/playwright:v1.44.0-jammy'
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
                    image 'mcr.microsoft.com/playwright:v1.44.0-jammy'
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
            echo "Build Successful"
        }

        failure {
            echo "Build Failed"
        }
    }
}

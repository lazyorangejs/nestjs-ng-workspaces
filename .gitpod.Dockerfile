FROM gitpod/workspace-full

ENV NODE_ENV=dev PORT=3000 AWS_CLI_VERSION=2.0.30 AWS_COPILOT_VERSION=v1.7.1 CLOUD_NUKE_VERSION=v0.1.30

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-${AWS_CLI_VERSION}.zip" -o "awscliv2.zip" &&\
  unzip awscliv2.zip &&\
  sudo ./aws/install

RUN wget https://github.com/aws/copilot-cli/releases/download/${AWS_COPILOT_VERSION}/copilot-linux-amd64-${AWS_COPILOT_VERSION} &&\
  chmod +x ./copilot-linux-amd64-${AWS_COPILOT_VERSION} &&\
  sudo mv ./copilot-linux-amd64-${AWS_COPILOT_VERSION} /usr/local/bin/copilot

### Install cloud nuke from github releases
### https://github.com/gruntwork-io/cloud-nuke/releases/tag/v0.1.30
RUN wget https://github.com/gruntwork-io/cloud-nuke/releases/download/${CLOUD_NUKE_VERSION}/cloud-nuke_linux_amd64 &&\
  chmod +x ./cloud-nuke_linux_amd64 &&\
  sudo mv ./cloud-nuke_linux_amd64 /usr/local/bin/cloud-nuke

### Install cloud nuke from home brew without pin version
### https://github.com/jckuester/awsls#installation
RUN brew install jckuester/tap/awsls

RUN sudo apt-get update && sudo apt-get install -y jq

ENV SONAR_SCANNER_OPTS "-Xmx1024m"
ENV SONAR_SCANNER_CLI_VERSION=4.4.0.2170

RUN curl --insecure -OL https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_CLI_VERSION}-linux.zip &&\
    unzip sonar-scanner-cli-${SONAR_SCANNER_CLI_VERSION}-linux.zip && ls

ENV PATH=~/sonar-scanner-${SONAR_SCANNER_CLI_VERSION}-linux/bin:$PATH

FROM gitpod/workspace-full

ENV NODE_ENV=dev PORT=3000 AWS_CLI_VERSION=2.0.30 AWS_COPILOT_VERSION=v1.6.0

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-${AWS_CLI_VERSION}.zip" -o "awscliv2.zip" &&\
  unzip awscliv2.zip &&\
  sudo ./aws/install

RUN wget https://github.com/aws/copilot-cli/releases/download/${AWS_COPILOT_VERSION}/copilot-linux-amd64-${AWS_COPILOT_VERSION} &&\
  chmod +x ./copilot-linux-amd64-${AWS_COPILOT_VERSION} &&\
  sudo mv ./copilot-linux-amd64-${AWS_COPILOT_VERSION} /usr/local/bin/copilot

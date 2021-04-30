FROM gitpod/workspace-full

ENV NODE_ENV=dev

RUN brew install awscli

RUN wget https://github.com/aws/copilot-cli/releases/download/v1.6.0/copilot-linux-amd64-v1.6.0 &&\
  chmod +x ./copilot-linux-amd64-v1.6.0 &&\
  mv ./copilot-linux-amd64-v1.6.0 /usr/local/bin/copilot

# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.183.0/containers/typescript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 16, 14, 12
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-list -here>"

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

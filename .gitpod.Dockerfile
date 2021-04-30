FROM gitpod/workspace-full

ENV NODE_ENV=dev

RUN brew install awscli aws/tap/copilot-cli

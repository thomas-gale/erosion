FROM ubuntu:18.04
LABEL maintainer="Thomas Gale (gale.thomasjames@gmail.com)"

# Configure a SUDO non-root user (no password)
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME
USER $USERNAME

# Update, install base packages and tools
RUN sudo apt-get update \
    && sudo apt-get -y install git gcc curl zip unzip apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common \
    #
    # Install Nodejs & Yarn
    && sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo bash - \
    && sudo apt-get install -y nodejs \
    && sudo curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list \
    && sudo apt-get update && sudo apt-get install -y yarn \
    #
    # Install ACT (github actions local test)
    && curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

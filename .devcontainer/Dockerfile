FROM ubuntu:18.04
LABEL maintainer="Thomas Gale (gale.thomasjames@gmail.com)"

# global settings
ENV CMAKE_VERSION=3.17.2

# configure a sudo non-root user (no password)
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

# update and install base packages and tools
RUN sudo apt-get update \
    && sudo apt-get install -y software-properties-common \
        unzip curl wget git \
        build-essential gdb \
        libtinfo-dev clang-8 \
        clang-format clang-tidy valgrind \
        python3.8 python3.8-dev python3-pip python-opengl \
        libopenmpi-dev zlib1g-dev libsm6 libxext6 libxrender-dev \
        libglfw3-dev libgles2-mesa-dev libsdl2-dev \
    #
    # cmake
    && mkdir -p ~/temp && cd ~/temp \
    && wget https://github.com/Kitware/CMake/releases/download/v$CMAKE_VERSION/cmake-$CMAKE_VERSION-Linux-x86_64.sh \
    && sudo mkdir /opt/cmake \
    && sudo sh cmake-$CMAKE_VERSION-Linux-x86_64.sh --prefix=/opt/cmake --skip-license \
    && sudo ln -s /opt/cmake/bin/cmake /usr/local/bin/cmake \
    && cd ~ && cmake --version \
    #
    # emscripten
    && cd ~ && git clone https://github.com/emscripten-core/emsdk.git && cd emsdk \
    && ./emsdk install latest \
    && ./emsdk activate latest \
    && echo "source \"/home/${USERNAME}/emsdk/emsdk_env.sh\"" >> /home/${USERNAME}/.bashrc \
    && cd ~ \
    #
    # libs for taichi / taichihub server
    && python3.8 -m pip install autopep8 pyyaml zmq \
    && python3.8 -m pip install taichi taichi_glsl taichi_three \
    && python3.8 -m pip install pymongo flask \
    && sudo apt-get install -y mongodb \
    #
    # install docker - x86_64 / amd64 stable
    && mkdir -p ~/temp && cd ~/temp \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - \
    && sudo add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable" \
    && sudo apt-get update \
    && sudo apt-get -y install docker-ce docker-ce-cli containerd.io \
    && cd ~ \
    #
    # nodejs & yarn
    && mkdir -p ~/temp && cd ~/temp \
    && sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo bash - \
    && sudo apt-get install -y nodejs \
    && sudo curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list \
    && sudo apt-get update && sudo apt-get install -y yarn \
    && cd ~ \
    #
    # act (github actions local test environment)
    && curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

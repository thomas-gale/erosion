FROM ghcr.io/thomas-gale/erosion-devcontainer:latest
LABEL maintainer="Thomas Gale (gale.thomasjames@gmail.com)"

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh
RUN sudo chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# version_settings() enforces a minimum Tilt version
# https://docs.tilt.dev/api.html#api.version_settings
version_settings(constraint='>=0.22.2')

docker_build(
    'web-frontend', 
    context='.',
    dockerfile="./Dockerfile.dev",
    live_update=[
        # when package.json changes, we need to do a full build
        fall_back_on(['package.json', 'package-lock.json']),
        sync('src', '/usr/src/app/src'),
    ]
)

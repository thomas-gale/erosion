#!/usr/bin/env python3

import subprocess
import shutil
import sys
import os

docker_image = 'taichihub'

# Derived from taichi.js/taichihub/compiler.py
def do_c_gen(target, source=None, extra=[]):
    if source is None:
        source = target

    envs = 'TI_ACTION_RECORD='

    print('Generating action record...')
    try:
        container = subprocess.check_output(['sudo', 'docker', 'create', '-a', 'STDOUT', '-a', 'STDERR',
                                             '-e', 'TI_ACTION_RECORD=/app/main.py.yml', '-e', 'TI_ARCH=cc',
                                             docker_image, 'python', 'main.py']).decode().strip()
        subprocess.check_call(
            ['sudo', 'docker', 'cp', source, container + ':/app/main.py'])
        for e in extra:
            subprocess.check_call(
                ['sudo', 'docker', 'cp', e, container + ':/app/' + os.path.basename(e)])
        try:
            output = subprocess.check_output(['sudo', 'docker', 'start', '-a', container],
                                             stderr=subprocess.STDOUT, timeout=20)
        except subprocess.CalledProcessError as e:
            print('Error while generating action record:')
            print(e.output)
            print('(END)')
            return e.output, 'failure'
        except subprocess.TimeoutExpired as e:
            print('Timeout while generating action record:')
            print(e.output)
            print('(END)')
            return e.output, 'timeout'

        print('The program output was:')
        print(output.decode())
        print('(END)')
        subprocess.check_call(
            ['sudo', 'docker', 'cp', container + ':/app/main.py.yml', f'{source}.yml'])
    except Exception as e:
        raise e
    finally:
        subprocess.call(['sudo', 'docker', 'rm', container])

    print('Composing C file...')
    subprocess.check_call([sys.executable, '-m', 'taichi', 'cc_compose',
                           '-e', f'{source}.yml', f'{source}.c', f'{source}.h'])

    return output, 'success'


if __name__ == '__main__':
    dst = None
    src = "./engine/src/taichi/mpm88.py"
    ext = ["./engine/lib/taichi.js/taichihub/static/hub.py"]

    print('compiling', src)
    output, status = do_c_gen(dst, src, ext)
    print('done with', src)

    output = output.decode()
    ret = {'status': status, 'output': output}
    print(status)

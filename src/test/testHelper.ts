import { spawn } from 'child_process';

export class TestHelper {

  static cmd(arr, cwd = __dirname) {
    // console.log('exec => ', arr.join(' '));

    const c0 = arr.shift();
    return new Promise((resolve, reject) => {
      const ssp = spawn(c0, arr, { stdio: 'inherit', cwd });
      ssp.on('close', (code) => {
        resolve(code);
      });

      ssp.on('error', function (err) {
        reject(err);
      });
    });
  }

  static sleep(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    })
  }

}
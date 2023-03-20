/**
 * prepares command for spawn()
 * example usage:
 * var spawn = require('child_process').spawn;
 * var command = 'python -V';
 * var args = prepareCommand(command);
 * var child = spawn(args[0], args.slice(1));
 * @param command 
 * @returns string[]
 */
export function prepareCommand(command): string[] {
    var args = command.split(' ');
    return args;
}

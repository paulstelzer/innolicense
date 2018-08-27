import gulp from 'gulp';

import runSequence from 'run-sequence';
import jeditor from 'gulp-json-editor';
import shell from 'gulp-shell';
import git from 'gulp-git';

import minimist from 'minimist';

const defaultOptions = {
    string: 'type',
    default: { type: 'patch' }
};

const options = minimist(process.argv.slice(2), defaultOptions);

const paths = [
    {
        src: 'client/package.json',
        path: 'client/'
    },
    {
        src: 'server/package.json',
        path: 'server/'
    }
]

/**
 * Default Task
 */
gulp.task('default', ['version']);

gulp.task('version', () => {
    switch (options.type) {
        case 'major':
            runSequence(
                'changelog:major',
                'version:update',
                'git:commit'
            )
            break;

        case 'minor':
            runSequence(
                'changelog:minor',
                'version:update',
                'git:commit'
            )
            break;

        case 'patch':
            runSequence(
                'changelog:patch',
                'version:update',
                'git:commit'
            )
            break;
    }
});


gulp.task('changelog:major', () => {
    return gulp.src('./CHANGELOG.md')
        .pipe(shell('npx changelog -M'))
        .pipe(git.add());
});

gulp.task('changelog:minor', () => {
    return gulp.src('./CHANGELOG.md')
        .pipe(shell('npx changelog -m'))
        .pipe(git.add());
});

gulp.task('changelog:patch', () => {
    return gulp.src('./CHANGELOG.md')
        .pipe(shell('npx changelog -p'))
        .pipe(git.add());
});

gulp.task('version:update', () => {
    let sources = [];
    for (let o of paths) {
        modifyJson(o.src, o.path, options.type);
        sources.push(o.src);
    }

    return gulp.src(sources)
        .pipe(git.add());
});

gulp.task('git:commit', () => {
    return gulp.src('')
        .pipe(git.commit('Updated CHANGELOG.md and version'))
        .pipe(shell(`npm version ${options.type}`));
})


function calculateNewVersion(version, type) {
    const split = version.split('.');

    if (type === 'major') {
        split[0] = (parseInt(split[0]) + 1).toString();
        split[1] = '0';
        split[2] = '0';
    } else if (type === 'minor') {
        split[1] = (parseInt(split[1]) + 1).toString();
        split[2] = '0';
    } else if (type === 'patch') {
        split[2] = (parseInt(split[2]) + 1).toString();
    }

    return split.join('.');
};

function modifyJson(source, targetFolder, type) {
    const { version } = require('./package.json');
    const newVersion = calculateNewVersion(version, type);
    return gulp.src(source)
        .pipe(
            jeditor({ 'version': newVersion })
        )
        .pipe(gulp.dest(targetFolder));
}


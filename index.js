const http = require( 'http' ); // Import Node.js core module
const { exec } = require( 'child_process' );
const { performance } = require( 'perf_hooks' );
const { v4: uuid } = require( 'uuid' );

/**
 * App Time Formatting
 * @param time
 * @returns {string}
 */
const appTimeFormatting = time => {
    const minutes = Math.floor( time / 60000 );
    const seconds = ( ( time % 60000) / 1000 ).toFixed( 0 );
    return minutes + ":" + ( seconds < 10 ? '0' : '' ) + seconds;
}

const jobs = {};

/**
 * Route Run Command
 *
 * @param res
 * @param cmd
 * @param appTimeBegin
 * @returns {{jobId: (*|string), jobsCompleted: number, appTimeEnd: number, appTime: number, appTimeFormatted: string, jobsCount: number, jobs: {}, appTimeBegin, message: string}}
 */
const routeRunCommand = ( cmd, appTimeBegin ) => {
    const runCommand = ( cmd, runCmdSuccess, runCmdError ) => {

        exec( cmd, ( error, stdout, stderr ) => {

            console.log( stdout );
            console.log( stderr );

            if ( error !== null ) {

                console.log( `exec error: ${error}` );

                if ( typeof runCmdError === 'function' ) {
                    return runCmdError( error );
                }
            }

            if ( typeof runCmdSuccess === 'function' ) {
                return runCmdSuccess( stdout );
            }
        } );
    }

    const jobId = uuid();
    const jobsCount = Object.keys( jobs ).length;
    let jobsCompleted = 0;
    for ( let jobIndex in jobs ) {
        let complete = jobs[ jobIndex ];
        if ( complete ) {
            jobsCompleted++;
        }
    }

    console.log( { jobs, jobsCount, jobsCompleted } );

    if ( !jobsCount || ( jobsCount <= jobsCompleted ) ) {
        jobs[ jobId ] = false;
        runCommand( cmd, function ( stdout ) {
            jobs[ jobId ] = true;
        } );
    }

    const appTimeEnd = performance.now();
    console.log( `[SSZDEVBOX] App Time: ${appTimeEnd - appTimeBegin}` );
    console.log( `[SSZDEVBOX] App Time Formatted: ` + appTimeFormatting( appTimeEnd - appTimeBegin ) );

    return {
        message: "Run Test Done!",
        jobId: jobId,
        jobsCount: jobsCount,
        jobsCompleted: jobsCompleted,
        jobs: jobs,
        appTimeBegin: appTimeBegin,
        appTimeEnd: appTimeEnd,
        appTime: ( appTimeEnd - appTimeBegin ),
        appTimeFormatted: appTimeFormatting( appTimeEnd - appTimeBegin ),
    };
}

const server = http.createServer( ( req, res ) => {

    const appTimeBegin = performance.now();

    // create web server
    if ( req.url === '/' ) { //check the URL of the current request

        // set response header
        // res.writeHead( 200, { 'Content-Type': 'text/html' } );
        res.writeHead( 200, { 'Content-Type': 'application/json' } );

        // set response content
        // res.write( '<html><body><p>This is home Page.</p></body></html>' );
        res.write( JSON.stringify( { message: 'Hello' } ) );
        res.end();

    } else if ( req.url === '/test' ) {
        const runCommandRes = routeRunCommand( `bash test/test.sh`, appTimeBegin );
        res.writeHead( 200, { 'Content-Type': 'application/json' } );
        res.write( JSON.stringify( runCommandRes ) );
        res.end();
    } else {
        res.end( 'Invalid Request!' );
    }
} );

server.listen( 3100 ); // 6 - listen for any incoming requests

console.log( '[SSZDEVOPS] Server: Running...' );
console.log( '[SSZDEVOPS] Port: 3100' );
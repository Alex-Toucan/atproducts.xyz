/* ncrypt.c
 *
 * compilation:
 *   gcc -Wall -Wextra -W -ansi -pedantic -o ncrypt{,.c} -lcrypt
 *
 */
#define _XOPEN_SOURCE   500 /* for l64a(3); see feature_test_macros(7) */

#include <stdio.h>      /* puts */
#include <stdlib.h>     /* l64a; needs _XOPEN_SOURCE >= 500 */
#include <sys/time.h>   /* struct timeval & gettimeofday */
#include <unistd.h>     /* getpid & getpass(see ln#8) */
#include <crypt.h>      /* crypt; compile with -lcrypt */
#include <string.h>     /* strcpy, strcat, strlen */
#include <time.h>       /* clock */

#define ENC_TOK     "$6$"
#define SEED_BUF    12

extern char *getpass(const char *); /* overriding unistd.h declaration */

char *mksalt(void) {
    struct timeval tv;
    static char result[SEED_BUF];

    strncpy(result, ENC_TOK, strlen(ENC_TOK) + 1);

    gettimeofday(&tv, (struct timezone *) 0);
    strcat(result, l64a(tv.tv_usec)); /* adds 3-4 chars */
    strncat(
        result,
        l64a(tv.tv_sec + getpid() + clock()),
        (SEED_BUF - (strlen(result) + 1))   /* account for the appended '\0' */
    );

    result[SEED_BUF - 1] = '\0';

    return result;
}

int main( int argc, char *argv[] ) {
    char *password;

    password = (argc == 2) ? crypt(argv[1], (const char *) mksalt()) : crypt((const char *) getpass("Password: "), (const char *) mksalt());

    puts(password);

    return 0;
}
/**
 * wp-publisher.js
 *
 * Writes a new page (or post) to WordPress via the standard core REST endpoint.
 * Kept separate from WPClient (lib/wp-client.js) so read paths used by the sync
 * script don't pull in any write-side surface area.
 *
 * Auth: HTTP Basic with an Application Password.
 */

const TIMEOUT_MS = 20000;

export class WPPublishError extends Error {
    constructor(message, { kind, status, body } = {}) {
        super(message);
        this.name = 'WPPublishError';
        this.kind = kind;
        this.status = status;
        this.body = body;
    }
}

export async function createDraft({
    baseUrl,
    user,
    pass,
    title,
    content,
    postType = 'pages',
    status = 'draft',
}) {
    if (!baseUrl) throw new WPPublishError('Missing WP_URL', { kind: 'config' });
    if (!user || !pass) throw new WPPublishError('Missing WP_USER or WP_PASS', { kind: 'config' });
    if (!title) throw new WPPublishError('Missing title', { kind: 'config' });
    if (!content) throw new WPPublishError('Missing content', { kind: 'config' });

    const trimmed = baseUrl.replace(/\/$/, '');
    const url = `${trimmed}/wp-json/wp/v2/${postType}`;
    const auth = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');

    let response;
    try {
        response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: auth,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ title, content, status }),
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
    } catch (err) {
        throw new WPPublishError(`Network error: ${err.message}`, { kind: 'network' });
    }

    const text = await response.text();
    let json;
    try {
        json = text ? JSON.parse(text) : {};
    } catch {
        json = {};
    }

    if (response.status === 401 || response.status === 403) {
        throw new WPPublishError(
            `Authentication failed (${response.status}). Run /hp-wp:hp-config to update credentials.`,
            { kind: 'auth', status: response.status, body: json }
        );
    }

    if (!response.ok) {
        const wpMessage = json?.message || text.slice(0, 200);
        throw new WPPublishError(
            `WP rejected the request (${response.status}): ${wpMessage}`,
            { kind: 'validation', status: response.status, body: json }
        );
    }

    const id = json.id;
    const editUrl = `${trimmed}/wp-admin/post.php?post=${id}&action=edit`;

    return {
        id,
        slug: json.slug,
        link: json.link,
        editUrl,
        status: json.status,
    };
}

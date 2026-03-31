export default async function handler(req, res) {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: "Missing query" });
    }

    try {
        const r = await fetch("https://apis.roblox.com/toolbox/v2/assets:search", {
            method: "POST",
            headers: {
                "x-api-key": process.env.ROBLOX_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                searchCategoryType: "Model",
                query: query,
                maxPageSize: 10
            })
        });

        const data = await r.json();
        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({
            error: "failed",
            message: err.message
        });
    }
}

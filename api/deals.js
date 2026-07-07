export default async function handler(req, res) {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSGy1ecJ96nFNxjc-PvOY4RC3HhwC8AYYTLG9MKUaTBgudoFLKgg5odzFMgMWA5-CIaNHIfXynI8kxq/pub?gid=0&single=true&output=csv'; 
    
    try {
        const response = await fetch(sheetUrl);
        const csv = await response.text();
        res.status(200).send(csv); 
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch deals' });
    }
}

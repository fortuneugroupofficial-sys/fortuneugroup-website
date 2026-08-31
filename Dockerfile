# ============================================================
# OPTIONAL — only used if you deploy this repo as a
# "Web Service" with Runtime = Docker.
#
# For this website the "Static Site" runtime (see render.yaml)
# is recommended: free tier, no sleeping, faster CDN delivery.
# ============================================================
FROM nginx:1.27-alpine

# Copy the static site (index.html, css/, js/, images/, pages) into nginx
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

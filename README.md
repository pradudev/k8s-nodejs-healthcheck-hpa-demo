# k8s-nodejs-healthcheck-hpa-demo

## Docker
docker build -t nodejs-healthcheck-demo:v1 .
docker tag nodejs-healthcheck-demo:v1 az104practiceacr01.azurecr.io/nodejs-healthcheck-demo:v1
docker push az104practiceacr01.azurecr.io/nodejs-healthcheck-demo:v1

## HELM
helm template --namespace nodejs-healthcheck-demo-ns ./helm-charts --output-dir ./helm-charts/specs -f ./helm-charts/values.yaml
helm package --version 1.0.0 --destination ./helm-charts/packages/ ./helm-charts
helm upgrade --namespace nodejs-healthcheck-demo-ns --install --wait --create-namespace nodejs-healthcheck-demo ./helm-charts/packages/nodejs-healthcheck-demo-1.0.0.tgz
helm uninstall nodejs-healthcheck-demo -n nodejs-healthcheck-demo-ns
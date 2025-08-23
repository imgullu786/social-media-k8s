MERN on Kubernetes (NodePort) - Quickstart

1) Create kind cluster with port mappings:
   kind create cluster --name mern --config kind-cluster.yaml

   PREREQS (cloud cluster recommended):
        - NGINX Ingress Controller installed
        - cert-manager installed
        - DNS A/AAAA record: {domain} -> Ingress LoadBalancer IP (or CNAME to cloud LB DNS name)

        Install controllers (example):
          kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
          kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml

2) Apply manifests:
   kubectl apply -f namespace.yaml
   kubectl apply -f secrets.yaml
   kubectl apply -f mongo-pv.yaml
   kubectl apply -f mongo-pvc.yaml
   kubectl apply -f mongo-deployment.yaml
   kubectl apply -f backend-deployment.yaml
   kubectl apply -f frontend-deployment.yaml
   kubectl apply -f ingress.yaml
   kubectl apply -f cert-manager.yaml

3) Access from host (kind):
   Frontend: http://localhost

4) Minikube alternatives:
   minikube start
   minikube service frontend -n mern --url
   minikube service backend -n mern --url

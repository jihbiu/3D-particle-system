class Plane extends THREE.Object3D{
    constructor(size2f, position){
        super();
        
        let geometry = new THREE.PlaneGeometry(100.0, 100.0, 30.0);
        let material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });

        let mesh = new THREE.Mesh(this.geometry, this.meterial);


        this.add(mesh);
    }
}
var proms = stocks.map(function (address) {
    return prom = new Promise(function (resolve, reject) {
        var retriesRemaining = 5;
        function run() {
            geocoder.geocode({
                address: address
            }, function (results, status) {

                if (status === google.maps.GeocoderStatus.OK) {
                    resolve({
                        results: results,
                        business: address
                    });

                } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    --retriesRemaining;
                    if (retriesRemaining <= 0) {
                        reject(status);
                    } else {
                        setTimeout(run, 1000);
                    }
                } else {
                    console.log(status + ': ' + results);
                }

            }
            });
}
        run();
    });
});
Promise.all(proms);